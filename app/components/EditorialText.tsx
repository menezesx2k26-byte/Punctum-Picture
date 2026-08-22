import { Fragment } from "react";

export function EditorialText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}
