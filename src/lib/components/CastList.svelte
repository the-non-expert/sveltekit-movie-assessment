<script lang="ts">
  import type { Movie } from '$lib/types/movie';

  interface Props {
    cast: NonNullable<Movie['cast']>;
  }

  let { cast = [] }: Props = $props();
</script>

<div class="relative">
  <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600">
    {#each cast as member (member.name)}
      <div class="flex-shrink-0 w-32 group">
        <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-700 mb-2">
          {#if member.profileUrl}
            <img
              src={member.profileUrl}
              alt={member.name}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          {:else}
            <div
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800"
            >
              <svg
                class="w-16 h-16 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {/if}
        </div>
        <h4 class="text-sm font-medium text-white truncate" title={member.name}>
          {member.name}
        </h4>
        <p class="text-xs text-gray-400 truncate" title={member.character}>{member.character}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .scrollbar-thin::-webkit-scrollbar {
    height: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.5);
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.8);
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.9);
  }
</style>
