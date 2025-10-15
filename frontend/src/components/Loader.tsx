import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="w-16 h-16 border-4 border-gray-500 border-t-white rounded-full mt-12"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
    />
  );
};

export default Loader;
