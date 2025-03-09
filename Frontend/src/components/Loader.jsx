import { Html } from '@react-three/drei';

const Loader = () => {
  return (
    <Html>
      <div className="flex justify-center items-center h-screen">
        <img src="./load.gif" alt="Loading..." />
      </div>
    </Html>
  );
};

export default Loader;
