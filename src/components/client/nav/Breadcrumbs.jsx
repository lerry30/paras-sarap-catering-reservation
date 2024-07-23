"use client";
import Link from "next/link";
import { sets } from "@/utils/client/breadcrumbs/links.js";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toNumber } from "@/utils/number";
import { ChevronRight } from "@/components/icons/All";

const Breadcrumbs = ({ step = 1, children }) => {
  const [service, setService] = useState("");
  const [linkSet, setLinkSet] = useState([]);
  const [series, setSeries] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();

  const nStep = toNumber(step);
  const services = {
    wedding: true,
    debut: true,
    kidsparty: true,
    privateparty: true,
  };
  const stepsName = ["theme", "venue", "package", "schedule", "review"];

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (!services.hasOwnProperty(serviceParam)) router.push("/");
    setService(serviceParam);

    const setParam = toNumber(searchParams.get("set"));
    const filteredSet = setParam < 1 || setParam > sets.length ? 1 : setParam;

    const series = toNumber(searchParams.get("series"));
    const fSeries = nStep > series ? nStep : series;

    // change url realtime
    const params = new URLSearchParams(searchParams.toString());
    params.set('series', `${fSeries}`);
    window.history.pushState(null, '', `?${params.toString()}`);

    const set = sets[filteredSet - 1].slice(0, fSeries);
    setLinkSet(set);
    setSeries(fSeries);
  }, []);

  return (
    <header className="w-full h-[calc(var(--nav-height)-16px)] flex items-center font-headings border-b-[1px] border-neutral-240 fixed top-[var(--nav-height)] left-0 z-subnavbar bg-white">
      <nav className="w-full py-2">
        <ul className="px-2 sm:px-page-x flex ">
          <li className="flex gap-4">
            {linkSet.map((link, index) => {
              return (
                <Link
                  key={index}
                  href={`${link}&service=${service}&series=${series}`}
                  className="flex items-center gap-4"
                >
                  <span className={`${nStep - 1 === index && "font-semibold"}`}>
                    {stepsName[index]}
                  </span>
                  <ChevronRight strokeWidth={1} />
                </Link>
              );
            })}
          </li>
          <li className="grow">{children}</li>
        </ul>
      </nav>
    </header>
  );
};

export default Breadcrumbs;
