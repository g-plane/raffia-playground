import type { Component } from 'solid-js'

const Header: Component = () => (
  <header class="h-14 p-3 grid grid-cols-2 bg-sky-50 border-b-width-2px border-b-sky-200">
    <div class="flex justify-between items-center">
      <div class="text-lg font-semibold">Raffia Playground</div>
      <div class="grid grid-cols-2 mr-15 text-sm text-sky-800 underline">
        <a
          href="https://github.com/g-plane/raffia"
          target="_blank"
          rel="noopener noreferrer"
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
