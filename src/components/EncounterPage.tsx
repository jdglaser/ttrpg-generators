import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

function Bestiary() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/data/bestiary/bestiary-mm.json").then(async (data) => {
      setData((await data.json()).monster);
    });
    setIsLoading(false);
  });

  if (isLoading) {
    return (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="darkslategrey"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  }

  return (
    <div style={{ maxHeight: "90vh", overflow: "scroll" }}>
      <table style={{ borderCollapse: "collapse", border: "1px solid black" }}>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.name}
              style={idx % 2 === 0 ? { backgroundColor: "lightgrey" } : {}}
            >
              <td style={{ border: "1px solid black", padding: "0 10px" }}>
                <span>{row.name}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EncounterPage() {
  return (
    <>
      <h1 style={{ marginTop: "0", lineHeight: "1em" }}>Encounters</h1>
      <Bestiary />
    </>
  );
}
