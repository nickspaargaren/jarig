import Head from 'next/head';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '../styles/Home.module.css';

dayjs.locale('nl');

const schema = z.object({
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1900).max(new Date().getFullYear()),
});

type Date = z.infer<typeof schema>;

const Home = () => {
  const [details] = useState<Date>({ day: 0, month: 0, year: 0 });
  const [info, setInfo] = useState<string | null>();

  const { register, handleSubmit, formState: { errors } } = useForm<Date>({
    resolver: zodResolver(schema),
  });

  const inputDate: string = dayjs(`${details.year}-${details.month}-${details.day}`).format('dddd').toLowerCase();

  const find = (date: Date) => {
    const inputDateYear = Number(dayjs(`${date.year}-${date.month}-${date.day}`).format('YYYY'));
    const currentDateYear = Number(dayjs().format('YYYY'));
    const birthdays = currentDateYear - inputDateYear;

    let history: string[] = [];

    for (let i = 0; i < birthdays; i += 1) {
      history = [...history, dayjs(`${currentDateYear - i}-${date.month}-${date.day}`).format('dddd').toLowerCase()];
    }

    const mode = (arr: string[]) => arr
      .sort(
        (a, b) => arr.filter((v) => v === a).length
          - arr.filter((v) => v === b).length,
      )
      .pop();

    const mostFrequent = mode(history);
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

        <form
          onSubmit={handleSubmit((data) => {
            find(data);
          })}
          className={styles.fields}
        >
          <div>
            Dag
            <input type="number" {...register('day', { valueAsNumber: true })} />
            {errors.day && <span>{errors.day.message}</span>}
          </div>
          <div>
            Maand
            <input type="number" {...register('month', { valueAsNumber: true })} />
            {errors.month && <span>{errors.month.message}</span>}
          </div>
          <div>
            Jaar
            <input type="number" {...register('year', { valueAsNumber: true })} />
            {errors.year && <span>{errors.year.message}</span>}
          </div>
          <div>
            <button type="submit">Bekijken</button>
          </div>
        </form>

        <div>{info && inputDate !== 'invalid date' && `U bent geboren op een ${inputDate}`}</div>
        <div>{info && `U bent het vaakst jarig geweest op een ${info}`}</div>

      </main>
    </div>
  );
};

export default Home;
