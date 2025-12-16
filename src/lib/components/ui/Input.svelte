<script lang="ts">
  interface Props {
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value?: string;
    name?: string;
    required?: boolean;
    error?: string;
    class?: string;
    oninput?: (event: Event) => void;
  }

  let {
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    name,
    required = false,
    error = '',
    class: className = '',
    oninput
  }: Props = $props();

  const baseClasses =
    'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  const normalClasses = 'border-gray-300 focus:border-blue-500';
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
</script>

<div class="w-full">
  <input
    {type}
    {placeholder}
    bind:value
    {name}
    {required}
    {oninput}
    class="{baseClasses} {error ? errorClasses : normalClasses} {className}"
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? `${name}-error` : undefined}
  />
  {#if error}
    <p id="{name}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
