<script lang="ts">
  interface Props {
    class?: string;
    children?: any;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-6 {className}">
  {@render children?.()}
</div>
