<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    'aria-label'?: string;
    children?: any;
  }

  let {
    variant = 'primary',
    type = 'button',
    disabled = false,
    onclick,
    class: className = '',
    'aria-label': ariaLabel,
    children
  }: Props = $props();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
  };

  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current';
</script>

<button
  {type}
  {disabled}
  onclick={onclick}
  class="{baseClasses} {variantClasses[variant]} {className}"
  aria-label={ariaLabel}
>
  {@render children?.()}
</button>
