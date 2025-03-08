import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
    children,
    keyValue,
    classname,
    initial = { opactiy: 0 },
    animate = { opactiy: 1 },
    transition = { duration: 1 },
}) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                className={classname}
                initial={initial}
                animate={animate}
                transition={transition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default AnimationWrapper;
