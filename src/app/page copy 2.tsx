// import Image from "next/image";

function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to my app</h1>

      aaaaaaaaa

      <button> bbbb </button>
      <MyButton title="I'm a button" />
    </div>
  );
}
