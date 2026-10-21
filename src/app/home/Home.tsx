import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Home.postcss';

export default function Home() {
    const { t } = useTranslation();
    const [random, setRandom] = useState<number>(0);

    function updateRandom() {
        setRandom(Math.floor(Math.random() * 100));
    }

    return (
        <div className="p-4">
            <div className="text-lg">
                {t("randomRandom", { random })}
            </div>

            <button
                className="mt-4 px-3 py-2 bg-site-fill text-site-on rounded"
                onClick={updateRandom}
            >
                {t("generateRandom")}
            </button>
        </div>
    );
}