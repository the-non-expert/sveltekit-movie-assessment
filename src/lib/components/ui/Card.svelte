<script lang="ts">
  interface Props {
    class?: string;
    children?: any;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6 {className}">
  {@render children?.()}
</div>
