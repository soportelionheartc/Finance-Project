import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Test Button");
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });
});
