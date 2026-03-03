type Props = {
    message: string;
    show: boolean;
  };
  
  export default function Toast({
    message,
    show,
  }: Props) {
  
    if (!show) return null;
  
    return (
      <div className="
        fixed
        bottom-6
        right-6
        bg-green-600
        text-white
        px-6
        py-3
        rounded-lg
        shadow-lg
        animate-fade-in
        z-50
      ">
        {message}
      </div>
    );
  }