type ICategory = {
    name: string;
    image: string;
};
export interface HomeTypes {
    title?: string;
    categories: ICategory[];
    btn?: string;
    className?: string;
    columns?: number;
}
export interface FlexSectionProps {
  title: string;
  description?: string;
  image: string;
  reverse?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  textRight?: boolean;
  border?: boolean;
  bigTitle?: boolean;
}