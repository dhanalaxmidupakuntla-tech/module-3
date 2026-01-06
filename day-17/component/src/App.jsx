function App() {

  return (
    // <div class="bg-amber-100 pb-5 m-5">
    // <p class="text-blue-500 bg-amber-200">
    //   hello this my tailwind css page
    // </p>
    // <p>dhanalami</p>
    // </div>

    <div class="bg-teal-200 h-screen w-screen ">
      <div class="bg-teal-400 px-6 py-4 text-teal-100 flex justify-between">
        <h1 class="text-1xl font-extrabold tracking-widest">My website</h1>
        <nav class="space-x-12"> {/*//gap-10 */}
          <a href="#">Home</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </nav>
      </div>
      <div class="space-y-8">
        <section class="text-center" >
          <h1 class="mb-4 text-xl font-semibold sm:text-blue-500 md:text-amber-900">Welcome to our </h1>
          <p >This is hero section</p>
        </section>
        <section>
          <h2 class="mb-4 text-xl font-semibold text-center">Features</h2>
          <div class="grid grid-cols-3 gap-9 max-sm:grid-cols-1 max-md:grid-cols-2 p-4 ">
            <div class="rounded bg-teal-300 p-4">Feature1</div>
            <div class="rounded bg-teal-300 p-4">Feature2</div>
            <div class="rounded bg-teal-300 p-4">Feature3</div>
            <div class="rounded bg-teal-300 p-4">Feature1</div>
            <div class="rounded bg-teal-300 p-4">Feature2</div>
            <div class="rounded bg-teal-300 p-4">Feature3</div>
          </div>
        </section>
      </div>
      <div class="bg-teal-100 py-6 text-center text-sm text-teal-400">&copy; 2025 My Website</div>
    </div>
  )
}

export default App ;