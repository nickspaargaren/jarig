import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import styles from '../styles/Home.module.css';

dayjs.locale('nl');

type Date = {
  date: number | null;
  month: number | null;
  year: number | null;
}

const Home = () => {
  const [details, setDetails] = useState<Date>({ date: 0, month: 0, year: 0 });
  const [info, setInfo] = useState<string | null>();

  const dateRef = useRef<any>(null);
  const monthRef = useRef<any>(null);
  const yearRef = useRef<any>(null);

  const inputDate: string = dayjs(`${details.year}-${details.month}-${details.date}`).format('dddd').toLowerCase();

  const find = (date: Date) => {
    const inputDateYear: any = dayjs(`${date.year}-${date.month}-${date.date}`).format('YYYY');
    const currentDateYear: any = dayjs().format('YYYY');
    const birthdays: any = currentDateYear - inputDateYear;

    let history: string[] = [];

    for (let i = 0; i < birthdays; i += 1) {
      history = [...history, dayjs(`${currentDateYear - i}-${date.month}-${date.date}`).format('dddd').toLowerCase()];
    }

    const mode = (arr: string[]) => arr
      .sort(
        (a: any, b: any) => arr.filter((v: any) => v === a).length
            - arr.filter((v: any) => v === b).length,
      )
      .pop();

    const mostFrequent: any = mode(history);
    setInfo(mostFrequent);
  };

  useEffect(() => {
    setInfo(null);
  }, [details]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Jarig</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Jarig</h1>

        <div className={styles.fields}>
          <div>
            Dag
            <input type="text" ref={dateRef} onChange={() => setDetails({ ...details, date: dateRef.current.value })} />
          </div>
          <div>
            Maand
            <input type="text" ref={monthRef} onChange={() => setDetails({ ...details, month: monthRef.current.value })} />
          </div>
          <div>
            Jaar
            <input type="text" ref={yearRef} onChange={() => setDetails({ ...details, year: yearRef.current.value })} />
          </div>
          <div>
            <button type="button" onClick={() => find(details)}>Bekijken</button>
          </div>
        </div>

        <div>{info && inputDate !== 'invalid date' && `U bent geboren op een ${inputDate}`}</div>
        <div>{info && `U bent het vaakst jarig geweest op een ${info}`}</div>

      </main>
    </div>
  );
};

export default Home;
