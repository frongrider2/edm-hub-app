import { FormEvent, useState } from "react";
import { Check } from "lucide-react";
import { useAppDispatch } from "@/states/hooks";
import { useModal } from "@/states/modal/hooks";
import { cn } from "@/lib/utils";
import { useAuthApi } from "@/hooks/use-api";
import { toast } from "react-toastify";
import { increment } from "@/states/counter/counterSlice";

interface PlaylistFormState {
  name: string;
  description: string;
}

export default function CreatePlaylistModal(): JSX.Element {
  const dispatch = useAppDispatch();
  const { closeModal } = useModal();
  const [form, setForm] = useState<PlaylistFormState>(() => ({
    name: "",
    description: "",
  }));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const api = useAuthApi();
    const result = await api.playlist
      .createPlaylist(form.name, form.description)
      .then((res) => {
        return res;
      });

    if (result.isSuccess) {
      closeModal("create-playlist");
      dispatch(increment());
      toast.success("Playlist created successfully");
    } else {
      toast.info(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="name"
            className="text-xs font-medium tracking-wide text-muted-foreground"
          >
            Name
          </label>
          <span className="text-[10px] text-muted-foreground/70">
            {form.name.length}/20
          </span>
        </div>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter playlist name"
          maxLength={20}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--neon-purple))]"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="description"
            className="text-xs font-medium tracking-wide text-muted-foreground"
          >
            Description
          </label>
          <span className="text-[10px] text-muted-foreground/70">
            {form.description.length}/35
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Enter playlist description"
          maxLength={35}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--neon-purple))]"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r bg-[hsl(var(--neon-purple))] px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(168,85,247,0.4)] transition hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] hover:scale-105 w-1/2"
        >
          Create playlist
        </button>
      </div>
    </form>
  );
}
