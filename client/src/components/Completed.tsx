import { useState } from 'react';

function Completed({ todos }: { todos: JSX.Element[] }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="container mt-8 flex max-w-[900px] flex-col justify-center
        space-y-4 px-2 md:px-20"
    >
      {!!todos.length && (
        <button
          onClick={() => setShow((prev) => !prev)}
          className="w-12 self-start rounded-sm border text-xs"
        >
          {show ? 'hide' : 'show'}
        </button>
      )}
      {show && <div className="space-y-2">{todos}</div>}
    </div>
  );
}

export default Completed;
