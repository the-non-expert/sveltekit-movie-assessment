<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    open?: boolean;
    onClose?: () => void;
    title?: string;
    children?: any;
  }

  let { open = $bindable(false), onClose, title = '', children }: Props = $props();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      close();
    }
  }

  function close() {
    open = false;
    onClose?.();
  }

  onMount(() => {
    const handleDocumentKeydown = (event: KeyboardEvent) => {
      handleKeydown(event);
    };
    document.addEventListener('keydown', handleDocumentKeydown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeydown);
    };
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      role="document"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 id="modal-title" class="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onclick={close}
          class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label="Close modal"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="p-6">{@render children?.()}</div>
    </div>
  </div>
{/if}
