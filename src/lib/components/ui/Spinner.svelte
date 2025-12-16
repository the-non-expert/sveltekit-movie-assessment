<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { size = 'md', class: className = '' }: Props = $props();

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
</script>

<div
  class="inline-block border-blue-600 border-t-transparent rounded-full animate-spin {sizeClasses[
    size
  ]} {className}"
  role="status"
  aria-label="Loading"
>
  <span class="sr-only">Loading...</span>
</div>
