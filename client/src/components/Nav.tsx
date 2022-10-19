function Component({ logout }: { logout: () => void }) {
  return (
    <nav className="mx-auto flex justify-between border p-4">
      <div className="flex w-36 items-center justify-around">
        <img src="vite.svg" alt="logo" className="h-8" />
        <h1 className="text-lg font-bold">sasta logo</h1>
      </div>
      <button onClick={logout} className="self-end rounded-lg border p-2">
        logout
      </button>
    </nav>
  );
}

export default Component;
