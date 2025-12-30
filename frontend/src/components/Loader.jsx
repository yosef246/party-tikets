import style from "./Loader.module.css";

export default function Loader({ text }) {
  return (
    <div className={style.loaderwrapper}>
      <div className={style.spinner}></div>
      <p className={style.ptext}>{text}</p>
    </div>
  );
}
