import type { Component } from 'solid-js'

const Header: Component = () => (
  <header class="h-14 p-3 grid grid-cols-2 bg-emerald-50 border-b-width-2px border-b-emerald-200">
    <div class="flex justify-between items-center">
      <div class="text-lg font-semibold text-stone-900">Raffia Playground</div>
      <div class="flex items-center mr-10 text-sm text-emerald-800 underline">
        <a
          href="https://github.com/g-plane/raffia"
          target="_blank"
          rel="noopener noreferrer"
          class="mr-4"
        >
          Raffia Repo
        </a>
        <a
          href="https://github.com/g-plane/raffia-playground"
          target="_blank"
          rel="noopener noreferrer"
        >
          Playground Repo
        </a>
      </div>
    </div>
  </header>
)

export default Header
