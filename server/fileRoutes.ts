import { Router, Request, Response, NextFunction } from 'express';
import { upload, UPLOADS_DIR } from './multerConfig';
import { storage } from './storage';
import fs from 'fs';
import path from 'path';

const router = Router();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Usuario no autenticado" });
}

// POST /api/files/upload - Upload a file
router.post('/upload', ensureAuthenticated, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    const userId = req.user!.id;
    const portfolioId = req.body.portfolioId ? parseInt(req.body.portfolioId, 10) : null;

    // Save file metadata to database
    const fileData = await storage.createFile({
      userId,
      portfolioId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    });

    res.json({
      id: fileData.id,
      url: fileData.url,
      filename: fileData.originalName,
      mimeType: fileData.mimeType,
      size: fileData.size
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo" });
  }
});

// GET /api/files/:id - Get file metadata
router.get('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const file = await storage.getFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Only allow owner to access
    if (file.userId !== req.user!.id) {
      return res.status(403).json({ error: "No tienes permiso para acceder a este archivo" });
    }

    res.json({
      id: file.id,
      url: file.url,
      filename: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      portfolioId: file.portfolioId,
      createdAt: file.createdAt
    });
  } catch (error) {
    console.error("Error al obtener archivo:", error);
    res.status(500).json({ error: "Error al obtener el archivo" });
  }
});

// GET /api/files/user/all - Get all files for authenticated user
router.get('/user/all', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const userFiles = await storage.getFilesByUserId(userId);

    res.json(userFiles.map(file => ({
      id: file.id,
      url: file.url,
      filename: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      portfolioId: file.portfolioId,
      createdAt: file.createdAt
    })));
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
});

// GET /api/files/portfolio/:portfolioId - Get files by portfolio
router.get('/portfolio/:portfolioId', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const portfolioId = parseInt(req.params.portfolioId, 10);
    const portfolioFiles = await storage.getFilesByPortfolioId(portfolioId);

    // Verify user owns these files
    const userId = req.user!.id;
    const userFiles = portfolioFiles.filter(f => f.userId === userId);

    res.json(userFiles.map(file => ({
      id: file.id,
      url: file.url,
      filename: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      assetId: file.assetId,
      createdAt: file.createdAt
    })));
  } catch (error) {
    console.error("Error al obtener archivos del portafolio:", error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
});

// GET /api/files/asset/:assetId - Get files by asset
router.get('/asset/:assetId', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId, 10);
    const assetFiles = await storage.getFilesByAssetId(assetId);

    // Verify user owns these files
    const userId = req.user!.id;
    const userFiles = assetFiles.filter(f => f.userId === userId);

    res.json(userFiles.map(file => ({
      id: file.id,
      url: file.url,
      filename: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      createdAt: file.createdAt
    })));
  } catch (error) {
    console.error("Error al obtener archivos del activo:", error);
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
});

// PATCH /api/files/:id/asset - Associate file with an asset
router.patch('/:id/asset', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const { assetId, portfolioId } = req.body;

    if (!assetId || !portfolioId) {
      return res.status(400).json({ error: "Se requiere assetId y portfolioId" });
    }

    const file = await storage.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Only owner can update
    if (file.userId !== req.user!.id) {
      return res.status(403).json({ error: "No tienes permiso para modificar este archivo" });
    }

    const updatedFile = await storage.updateFileAssetId(fileId, assetId, portfolioId);
    res.json({
      id: updatedFile!.id,
      url: updatedFile!.url,
      assetId: updatedFile!.assetId,
      portfolioId: updatedFile!.portfolioId
    });
  } catch (error) {
    console.error("Error al asociar archivo con activo:", error);
    res.status(500).json({ error: "Error al asociar el archivo" });
  }
});

// PATCH /api/files/:id/portfolio - Update file's portfolioId (for associating after portfolio creation)
router.patch('/:id/portfolio', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const { portfolioId } = req.body;

    if (!portfolioId) {
      return res.status(400).json({ error: "Se requiere portfolioId" });
    }

    const file = await storage.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Only owner can update
    if (file.userId !== req.user!.id) {
      return res.status(403).json({ error: "No tienes permiso para modificar este archivo" });
    }

    const updatedFile = await storage.updateFilePortfolioId(fileId, portfolioId);
    res.json({
      id: updatedFile!.id,
      url: updatedFile!.url,
      portfolioId: updatedFile!.portfolioId
    });
  } catch (error) {
    console.error("Error al actualizar archivo:", error);
    res.status(500).json({ error: "Error al actualizar el archivo" });
  }
});

// DELETE /api/files/:id - Delete a file
router.delete('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const file = await storage.getFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Only owner can delete
    if (file.userId !== req.user!.id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este archivo" });
    }

    // Delete from filesystem
    const filePath = path.join(UPLOADS_DIR, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await storage.deleteFile(fileId);

    res.json({ success: true, message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    res.status(500).json({ error: "Error al eliminar el archivo" });
  }
});

export default router;
