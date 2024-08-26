import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-3.5 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          <Image
            src="/logo-text-black.svg"
            alt="Avocado"
            width={100}
            height={50}
            className="block h-6 w-auto dark:hidden"
          />
          <Image
            src="/logo-text-white.svg"
            alt="Avocado"
            width={100}
            height={50}
            className="hidden h-6 w-auto dark:block"
          />
        </Link>
        <div className="flex flex-row items-center justify-center gap-8">
          <SearchField />
          <UserButton className="" />
        </div>
      </div>
    </header>
  );
}
