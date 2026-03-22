import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { gerPreSignedUrls, generateUploadAbleFiles } from '@/services/s3.service';
import { createCapspule } from '@/services/capsule.service';

interface ModalPropType {
    setIsOpen: (state: boolean) => void;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const formSchema = z.object({
    title: z.string().min(5, 'Title has to be at least 5 characters'),
    message: z.string().min(15, 'Message has to be at least 15 characters').max(500, 'Message MAX character is 500'),
    unlockDate: z.date('Unlock date is required').refine((date) => date > today, {
        message: "The date must be greater than today's date",
    }),
    files: z.array(z.any()),
    recipients: z.array(z.string().email()).min(1, 'Add at least one recipient'),
});

interface InputType extends z.infer<typeof formSchema> {}

const CapsuleModal = ({ setIsOpen }: ModalPropType) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InputType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            message: '',
            files: [],
            recipients: [],
        },
    });

    const [error, setError] = useState<string | null>(null);

    // --- STATE FOR RECIPIENTS (EMAILS) ---
    const [emailInput, setEmailInput] = useState('');
    const [emailInputError, setEmailInputError] = useState<string | null>(null);
    const recipients = watch('recipients');

    // --- STATE FOR FILES ---
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const files = watch('files');

    const handleAddRecipient = () => {
        const validationResult = z.string().email().safeParse(emailInput);
        if (!emailInput) {
            setEmailInputError('Email cannot be empty');
            return;
        }
        if (!validationResult.success) {
            setEmailInputError('Please enter a valid email address');
            return;
        }

        const currentRecipients = recipients || [];
        if (currentRecipients.includes(emailInput)) {
            setEmailInputError('This email has already been added');
            return;
        }

        setValue('recipients', [...currentRecipients, emailInput]);
        setEmailInput('');
        setEmailInputError(null);
    };

    const handleRemoveRecipient = (emailToRemove: string) => {
        setValue(
            'recipients',
            recipients.filter((e) => e !== emailToRemove),
        );
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const newFiles = Array.from(fileList);
            // Add new files to our local state
            setSelectedFiles((prev) => [...prev, ...newFiles]);
            // Update form validation (just to pass schema check, we use selectedFiles for actual data)
            setValue('files', [...(files || []), ...newFiles], {
                shouldValidate: true,
            });
        }

        console.log('files : ', fileList);
        e.target.value = '';
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        // Update form validation state
        setValue(
            'files',
            selectedFiles.filter((_, idx) => idx !== indexToRemove),
            { shouldValidate: true },
        );
    };

    const handleModalCloth = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setIsOpen(false);
    };

    const onSubmit = async (data: InputType) => {
        console.log('Form Submitted: ', data);

        const { files } = data;

        // First, extract the filenames to request pre-signed URLs from the backend
        const fileNames = files.map((f: File) => f.name);

        try {
            // 1. Get pre-signed URLs for each file
            const urls = await gerPreSignedUrls(fileNames);

            // 2. Upload each file directly to S3 using the pre-signed URLs
            // Note: generateUploadAbleFiles now correctly uses PUT and sets Content-Type headers
            const uploadPromises = generateUploadAbleFiles(files, urls);
            await Promise.all(uploadPromises);

            // 3. Transform the raw File objects into the metadata format the backend expects.
            // Since the backend uses the filename as the key, we map it accordingly.
            const formattedFiles = files.map((file: File) => ({
                s3_key: file.name,
                original_name: file.name,
                file_size: file.size,
                mime_type: file.type,
            }));

            // 4. Send the complete capsule data to the database
            // This includes the metadata for the files we just successfully uploaded.
            await createCapspule({
                ...data,
                files: formattedFiles,
            });

            // Close the modal after successful creation
            setIsOpen(false);
        } catch (error) {
            setError(`error creating capsule : ${error}`);
            console.log('Error : ', error);
        }
    };

    return (
        <section
            className="fixed top-0 left-0 z-40 flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.2)]"
            onClick={handleModalCloth}
        >
            <form
                className="relative w-lg rounded-2xl bg-white p-6 shadow-lg sm:w-2xl md:w-3xl"
                onSubmit={handleSubmit(onSubmit)}
            >
                {error && <span className="text-center text-2xl font-bold text-red-500">{error}</span>}
                <button
                    type="button"
                    className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    onClick={() => setIsOpen(false)}
                >
                    <X />
                </button>
                <h1 className="text-center text-2xl font-bold">Create Capsule</h1>
                <section className="flex flex-col gap-4">
                    {/* TITLE */}
                    <div>
                        <label className="font-medium" htmlFor="title">
                            Title:
                        </label>
                        <Input id="title" placeholder="eg,. Birthday Photo" {...register('title')} />
                        {errors.title && (
                            <span className="pt-2 text-xs font-medium text-red-500">{errors.title.message}</span>
                        )}
                    </div>

                    {/* MESSAGE */}
                    <div>
                        <label className="font-medium" htmlFor="message">
                            Message:
                        </label>
                        <Textarea id="message" placeholder="Write your message..." {...register('message')} />
                        {errors.message && (
                            <span className="pt-2 text-xs font-medium text-red-500">{errors.message.message}</span>
                        )}
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="mr-3 font-medium" htmlFor="unlockDate">
                            Unlock Date:
                        </label>
                        <Input
                            id="unlockDate"
                            type="date"
                            {...register('unlockDate', { valueAsDate: true })}
                            className="cursor-pointer"
                        />
                        {errors.unlockDate && (
                            <span className="pt-2 text-xs font-medium text-red-500">{errors.unlockDate.message}</span>
                        )}
                    </div>

                    {/* FILES */}
                    <div>
                        <h2 className="mb-1 font-medium">Add Files</h2>
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="cursor-pointer border-2 bg-white"
                        />

                        {/* Display Uploaded Files */}
                        <div className="my-3 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-5">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="group relative w-20">
                                    <div className="w-fill flex h-16 items-center justify-center truncate rounded bg-gray-200 p-1 text-center text-xs text-wrap text-gray-500">
                                        {file.name}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(idx)}
                                        className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECIPIENTS */}
                    <div>
                        <h2 className="font-medium">Add Recipients</h2>
                        <div>
                            <div className="my-4 flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="eg,. example@gmail.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer border-black"
                                    onClick={handleAddRecipient}
                                >
                                    ADD
                                </Button>
                            </div>
                            {emailInputError && (
                                <span className="text-xs font-medium text-red-500">{emailInputError}</span>
                            )}
                        </div>

                        {/* Display Emails List */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {recipients.map((email) => (
                                <div
                                    key={email}
                                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm"
                                >
                                    {email}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRecipient(email)}
                                        className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center">
                        <Button
                            type="submit"
                            className="text-1xl transform cursor-pointer font-bold transition-all duration-300 hover:-translate-y-1 active:translate-y-1"
                        >
                            Create
                        </Button>
                    </div>
                </section>
            </form>
        </section>
    );
};

export default CapsuleModal;
