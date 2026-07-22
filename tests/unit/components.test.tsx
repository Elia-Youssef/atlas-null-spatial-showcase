import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ActionLink, Button, Heading, Reveal, StatusBadge } from "@/components";

describe("public component contracts", () => {
  it("exposes native button behavior and forwards interaction callbacks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Initialize</Button>);
    await user.click(screen.getByRole("button", { name: /initialize/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("makes a loading action busy, disabled, and explicit", () => {
    render(<Button loading>Initialize</Button>);

    const button = screen.getByRole("button", { name: /processing/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("preserves anchor semantics for external actions", () => {
    render(
      <ActionLink external href="https://example.com">
        External system
      </ActionLink>,
    );

    const link = screen.getByRole("link", { name: /external system/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("supports deliberate heading levels", () => {
    render(<Heading as="h3">System architecture</Heading>);

    expect(
      screen.getByRole("heading", { level: 3, name: /system architecture/i }),
    ).toBeVisible();
  });

  it("communicates status in text without depending on color", () => {
    render(<StatusBadge status="standby" />);

    expect(screen.getByText("standby")).toBeVisible();
  });

  it("keeps reveal content visible before client hydration", () => {
    const markup = renderToStaticMarkup(<Reveal trigger="mount">Critical headline</Reveal>);

    expect(markup).toContain("opacity:1");
    expect(markup).not.toContain("opacity:0");
  });
});
