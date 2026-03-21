import React, { useState } from "react";
import File from "@/components/File";
import Recipient from "@/components/Recipient";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCapsuleDetaile, deleteCapsule } from "@/services/capsule.service";
import { format } from "date-fns";
import axios from "axios";

const CapsuleDetailes = () => {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const capsuleId = id?.toString();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["capsule", capsuleId],
    queryFn: async () => await getCapsuleDetaile(capsuleId),
  });

  if (id === undefined) {
    return <p>capsule with id of {id} is not found</p>;
  }

  if (isPending) return <p>Loading</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const handlDelete = async (id: string) => {
    try {
      const data = await deleteCapsule(id);
      alert(`capsule is deleted , ID : ${data.id}`);

      navigate("/capsules");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setDeleteError(error.response.data.message);
      } else {
        setDeleteError("Failed to delete capsule");
      }
    }
  };

  return (
    <section>
      {deleteError && (
        <span className="my-3 text-2xl font-bold text-red-500">
          {deleteError}
        </span>
      )}
      <div className="mb-4 flex items-center justify-between">
        <Link to="/capsules">
          <ArrowLeft size={28} />
        </Link>
        <div className="flex gap-4">
          {/* <Button
            className="cursor-pointer font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-0"
            variant={"outline"}
          >
            Edit
          </Button> */}
          <Button
            className="cursor-pointer font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-0"
            variant={"destructive"}
            onClick={() => handlDelete(id)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="border-t-2 p-2 pt-4 sm:p-4">
        <h1 className="mb-4 text-2xl font-extrabold text-black sm:text-4xl">
          {data.title}
        </h1>
        <p className="my-4 text-gray-600">
          Create on: {format(data.created_at, "PPP")}
        </p>
        <p className="max-w-3xl text-lg sm:text-xl">
          <span className="font-bold underline">Message:</span>{" "}
          {data.message_body}
        </p>
        <div className="my-5">
          <h2 className="text-xl underline">Files:</h2>
          <div className="mt-3 flex gap-3">
            {data.files.length > 0 ? (
              data.files.map((f: { id: string; file_name: string }) => (
                <File id={f.id} key={f.id} file_name={f.file_name} />
              ))
            ) : (
              <p>No File</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl underline">Recipient:</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {data.recipients.length > 0 ? (
              data.recipients.map((r: { email: string; id: string }) => (
                <Recipient email={r.email} key={r.id} />
              ))
            ) : (
              <p>No recipients</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapsuleDetailes;
