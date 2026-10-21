import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../lib/components/button/Button';
import './error-page.css';

export default function ErrorPage({ code }: { code: '404' | '500' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function goBack() {
    if (typeof window.history.state?.idx === 'number' && window.history.state.idx > 0) navigate(-1);
    else navigate('/', { replace: true });
  }

  return (
    <main className="error-page-page" aria-labelledby="error-page-title">
      <div className="error-page-art" data-code={code} aria-hidden="true">
        {code === '500' ? <>
          <div className="error-page-number error-page-stumble">5<span>0</span><span className="error-page-fallen-zero">0</span></div>
          <svg className="error-page-ground" width="430" height="60" viewBox="0 0 430 60" fill="none">
            <path d="M18 22h245l8-6 9 6h132" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="m278 22-8 10 13 5-9 13M310 12l7-8M326 20l11-2M301 5l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M46 37h35m268 4h28" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </> : <>
        <div className="error-page-orbit"><span /></div>
        <div className="error-page-number">{code[0]}<span>{code[1]}</span>{code[2]}</div>
        <svg className="error-page-spark" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        </>}
      </div>
      <div className="error-page-copy">
        <p className="error-page-status"><span aria-hidden="true" />{t(code === '404' ? 'notFound' : 'error500Status')}</p>
        <h1 id="error-page-title">{t(code === '404' ? 'error404Title' : 'error500Title')}</h1>
        <p className="error-page-description">{t(code === '404' ? 'error404Description' : 'error500Description')}</p>
        <div className="error-page-actions">
          <Button to="/" variant="primary">{t('backHome')}</Button>
          <Button to="/components/button" variant="outline">{t('tryComponents')}</Button>
        </div>
        <button type="button" className="error-page-back" onClick={goBack}>
          <span aria-hidden="true">←</span>{t('error404Back')}
        </button>
      </div>
    </main>
  );
}
