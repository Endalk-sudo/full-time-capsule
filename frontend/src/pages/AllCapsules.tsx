import React, { useState } from 'react';
import CapsuleCard from '@/components/CapsuleCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getCapsules } from '@/services/capsule.service';
import CapsuleModal from '@/components/CapsuleModal';
import { format } from 'date-fns';

const AllCapsules = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['capsules'],
        queryFn: getCapsules,
    });

    if (isPending) return <p>Loading</p>;
    if (isError) return <p className="text-red-500">Error: {error.message}</p>;

    console.log('DATA : ', data);

    return (
        <>
            {isModalOpen && <CapsuleModal setIsOpen={setIsModalOpen} />}
            <section className="">
                <div className="mb-4 flex justify-end">
                    <Button
                        variant={'secondary'}
                        className="transform cursor-pointer font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-0"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Capsule
                    </Button>
                </div>
                <section
                    className={`border-t-2 pt-4  ${data.length === 0 ? '' : 'grid grid-cols-1 gap-4  sm:grid-cols-2'}`}
                >
                    {data.length === 0 ? (
                        <div className="flex justify-center">
                            <p className="text-gray-500 text-center">There is no Capsule</p>
                        </div>
                    ) : (
                        data.map(
                            (c: {
                                id: string;
                                title: string;
                                unlock_date: string;
                                created_at: string;
                                status: string;
                            }) => (
                                <CapsuleCard
                                    id={c.id}
                                    key={c.id}
                                    title={c.title}
                                    createdAt={c.created_at}
                                    unlockAt={format(c.unlock_date, 'PPP')}
                                    status={c.status}
                                />
                            ),
                        )
                    )}
                </section>
            </section>
        </>
    );
};

export default AllCapsules;
