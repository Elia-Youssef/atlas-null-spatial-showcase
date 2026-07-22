import { createRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TransmissionForm } from "@/components";
import type {
  SubmissionAdapter,
  TransmissionFormHandle,
  TransmissionPayload,
} from "@/types";

const validPayload: TransmissionPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  brief: "Design an adaptive spatial interface for our new platform.",
};

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    return window.setTimeout(() => callback(0), 0);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TransmissionForm", () => {
  it("focuses the first invalid field and does not call its adapter", async () => {
    const user = userEvent.setup();
    const adapter = vi.fn<SubmissionAdapter>();

    render(<TransmissionForm adapter={adapter} />);
    await user.click(screen.getByRole("button", { name: /send signal/i }));

    const name = screen.getByRole("textbox", { name: /your name/i });
    await waitFor(() => expect(document.activeElement).toBe(name));
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(adapter).not.toHaveBeenCalled();
  });

  it("passes validated data to the injected adapter", async () => {
    const user = userEvent.setup();
    const adapter = vi.fn<SubmissionAdapter>().mockResolvedValue({
      success: true,
      message: "Local receipt created.",
      receiptId: "AN-TEST0001",
    });

    render(<TransmissionForm adapter={adapter} initialValue={validPayload} />);
    await user.click(screen.getByRole("button", { name: /send signal/i }));

    await waitFor(() =>
      expect(adapter).toHaveBeenCalledWith(expect.objectContaining(validPayload)),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Local receipt created.");
  });

  it("exposes a narrow imperative reset handle", async () => {
    const user = userEvent.setup();
    const handle = createRef<TransmissionFormHandle>();

    render(<TransmissionForm ref={handle} />);
    await user.type(screen.getByRole("textbox", { name: /your name/i }), "Grace Hopper");

    act(() => handle.current?.reset());

    expect(screen.getByRole("textbox", { name: /your name/i })).toHaveValue("");
  });
});
