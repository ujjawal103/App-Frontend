import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const HomeEndNote = () => {
  return (
    <div className="flex flex-col items-start justify-center text-left py-16 px-4  bg-gray-200">

      {/* MAIN TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="leading-tight md:pl-10"
      >
        <p className="text-5xl md:text-7xl font-bold text-gray-400">
          Just
        </p>
        <p className="text-6xl md:text-8xl font-extrabold text-gray-500">
          Tap it<span className="text-pink-600">!</span>
        </p>
      </motion.div>

      {/* SUB TEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-6 text-sm md:text-base text-gray-500 md:pl-10"
      >
        crafted with{" "}
        <span className="text-pink-500">❤️</span>{" "}
        in <span className="font-semibold">Lucknow</span>
      </motion.p>

      <motion.div className="w-full flex flex-col items-center">

        {/* PROMO BANNER */}
        <div className="w-full h-26 md:h-52 md:max-w-[800px] mt-8 mb-4 border-2 border-pink-600 rounded-lg overflow-hidden shadow-lg flex justify-center items-center">
          <img
            src="/appPromo.png"
            alt="App banner"
            className="object-cover mt-3"
          />
        </div>

        {/* SHARE APP (WHATSAPP) */}
        <motion.a
          href={`https://wa.me/?text=${encodeURIComponent(
            "Check out TAP RESTO 🚀\nManage your business easily.\nDownload here: http://frontend-self-nine-51.vercel.app/tap-resto.apk"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition group"
        >
          {/* WhatsApp Share Icon */}
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.52 3.48A11.87 11.87 0 0012.03 0C5.4 0 .04 5.36.04 11.99c0 2.11.55 4.17 1.59 6.01L0 24l6.16-1.62a11.94 11.94 0 005.87 1.5h.01c6.63 0 11.99-5.36 11.99-11.99 0-3.2-1.25-6.2-3.51-8.41zM12.04 22a9.94 9.94 0 01-5.06-1.38l-.36-.21-3.65.96.97-3.56-.23-.37a9.95 9.95 0 1118.33-5.55c0 5.49-4.47 9.96-9.96 9.96zm5.47-7.46c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.15 4.53.72.31 1.29.5 1.73.64.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
          </svg>

          <span className="underline underline-offset-2 font-medium flex items-center gap-1">
            Share this app
            <span className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
        </motion.a>

      </motion.div>

    </div>
  );
};

export default HomeEndNote;