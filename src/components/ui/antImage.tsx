import { Image, ImageProps } from "antd";

export default function AntImage(props: ImageProps) {
  const previewProps = props.preview
    ? {
        ...(typeof props.preview === "object" ? props.preview : {}),
        getContainer: () => document.body,
      }
    : false;

  return <Image alt={props.alt || ""} {...props} preview={previewProps} />;
}
