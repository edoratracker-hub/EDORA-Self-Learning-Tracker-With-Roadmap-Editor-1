import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SQL_COURSE_SLUG } from './BuyButton';

import { courseProgressOptions } from '../../queries/course-progress';
import { queryClient } from '../../stores/query-client';

export function AccountButton() {
  const [isVisible, setIsVisible] = useState(false);

  const { data: courseProgress, isLoading: isLoadingCourseProgress } = useQuery(
    courseProgressOptions(SQL_COURSE_SLUG),
    queryClient,
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const buttonClasses =
    'rounded-full px-5 py-2 text-base font-medium text-yellow-700 hover:text-yellow-500 transition-colors';

  const hasEnrolled = !!courseProgress?.enrolledAt;

  if (!isVisible || isLoadingCourseProgress) {
    return <button className={`${buttonClasses} opacity-0`}>...</button>;
  }

  return (
    <a
      href={`${import.meta.env.PUBLIC_COURSE_APP_URL}/${SQL_COURSE_SLUG}`}
      className={`${buttonClasses} animate-fade-in`}
    >
      Start Learning
    </a>
  );
}
