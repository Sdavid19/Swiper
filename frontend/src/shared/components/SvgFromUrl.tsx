import { SvgXml } from "react-native-svg";
import { useEffect, useState } from "react";

type SvgFromUriProps = {
    uri?: string | null
}

export function SvgFromUrl({ uri }: SvgFromUriProps) {
  const [xml, setXml] = useState("");

  useEffect(() => {
    if(!uri) return;
    fetch(uri)
      .then(res => res.text())
      .then(svg => {
        let cleaned = svg;

        cleaned = cleaned.replace(/viewBox="([^"]+)"/, (match, content) => {
          const nums = content.split(" ");
          if (nums.length === 3) {
            return `viewBox="${nums[0]} ${nums[1]} ${nums[2]} 200"`; 
          }
          return match;
        });

        cleaned = cleaned.replace(/>([^<]+)</g, (match, text) => {
          if (text.trim().length > 0) {
            return `><`;
          }
          return match;
        });

        setXml(cleaned);
      });
  }, [uri]);

  if (!xml) return null;

  return <SvgXml xml={xml} width="80%" height={45} />;
}
