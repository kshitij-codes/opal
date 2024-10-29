import { Card, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import React from 'react';

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const GlobalCard = ({ title, description, footer, children }: Props) => {
  return (
    <Card className="bg-transparent mt-4">
      <CardHeader className='p-4'>
        <CardTitle className='text-md text-[#9d9d9d]'>{title}</CardTitle>
        <CardDescription className='text-[#707070]'>{description}</CardDescription>
      </CardHeader>
      <div className='p-4'>{children}</div>
      {footer && <div className='p-4'>{footer}</div>}
    </Card>
  );
};

export default GlobalCard;
