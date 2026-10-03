import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

let modalIdCounter = 0;

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  readonly isOpen = input(false);
  readonly title = input('');
  readonly maxWidth = input('440px');

  readonly closed = output<void>();

  /** Unique id so aria-labelledby points at this dialog's heading. */
  readonly titleId = `app-modal-title-${modalIdCounter++}`;

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  private lastFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.lastFocused = (this.document?.activeElement as HTMLElement) ?? null;
        this.onEscapeListener();
        // Move focus into the dialog so keyboard users land inside it.
        queueMicrotask(() => this.focusFirstElement());
      } else {
        this.removeEscapeListener();
        // Return focus to whatever opened the dialog.
        this.lastFocused?.focus?.();
        this.lastFocused = null;
      }
    });
  }

  onClose() {
    this.closed.emit();
  }

  private readonly escapeHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen()) {
      event.stopPropagation();
      this.onClose();
    }
  };

  private onEscapeListener(): void {
    this.document?.addEventListener?.('keydown', this.escapeHandler);
  }

  private removeEscapeListener(): void {
    this.document?.removeEventListener?.('keydown', this.escapeHandler);
  }

  private focusFirstElement(): void {
    const host = this.dialogRef()?.nativeElement;
    if (!host) {
      return;
    }

    const focusable = host.querySelector<HTMLElement>(
      'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );

    (focusable ?? host).focus?.();
  }
}