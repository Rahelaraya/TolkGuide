import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import "./CreateBooking.css";
import { apiFetch } from "../api/http";
import type { CreateBookingDto } from "../types.booking";

const schema = z
  .object({
    customerId: z.coerce.number().int().positive("CustomerId måste vara > 0"),
    languageId: z.coerce.number().int().positive("LanguageId måste vara > 0"),
    interpreterId: z.coerce.number().int().positive().nullable().optional(),
    startTime: z.string().min(1, "Starttid krävs"),
    endTime: z.string().min(1, "Sluttid krävs"),
    location: z.string().min(3, "Plats måste vara minst 3 tecken"),
    notes: z.string().optional(),
  })
  .refine((v) => new Date(v.endTime) > new Date(v.startTime), {
    message: "Sluttid måste vara efter starttid",
    path: ["endTime"],
  });

type FormData = z.infer<typeof schema>;

export default function CreateBooking() {
  const nav = useNavigate();

  const [params] = useSearchParams();
  const interpreterIdParam = params.get("interpreterId");
  const interpreterIdFromUrl =
    interpreterIdParam && !Number.isNaN(Number(interpreterIdParam))
      ? Number(interpreterIdParam)
      : null;

  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      customerId: 1,
      interpreterId: interpreterIdFromUrl, // ✅ HÄR: förifyll från URL
      languageId: 1,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      location: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      setServerError("");
      setIsSaving(true);

      const dto: CreateBookingDto = {
        customerId: Number(values.customerId),
        interpreterId: values.interpreterId ?? null,
        languageId: Number(values.languageId),
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
        notes: values.notes ?? "",
      };

      const created = await apiFetch<any>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      const newId = created?.id;
      nav(newId ? `/bookings/${newId}` : "/bookings");
    } catch (e: any) {
      setServerError(e?.message ?? "Kunde inte skapa bokning");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) return <Loading text="Skapar bokning..." />;

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h2 className="title">Skapa bokning</h2>
          <p className="subtitle">Fyll i uppgifter och spara bokningen.</p>
        </div>

        {serverError && <ErrorState message={serverError} />}

        {/* ✅ Bonus: visa att man bokar en specifik tolk */}
        {interpreterIdFromUrl && (
          <div className="hint">Du bokar tolk-id: {interpreterIdFromUrl}</div>
        )}

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="fieldGrid">
            <label className="label">
              CustomerId
              <input className="input" type="number" {...register("customerId")} />
              {errors.customerId && (
                <div className="errorText">{errors.customerId.message}</div>
              )}
            </label>

            <label className="label">
              LanguageId
              <input className="input" type="number" {...register("languageId")} />
              {errors.languageId && (
                <div className="errorText">{errors.languageId.message}</div>
              )}
            </label>
          </div>

          <label className="label">
            InterpreterId (valfritt)
            <input className="input" type="number" {...register("interpreterId")} />
            {errors.interpreterId && (
              <div className="errorText">{errors.interpreterId.message as any}</div>
            )}
          </label>

          <div className="fieldGrid">
            <label className="label">
              Start (ISO)
              <input
                className="input"
                placeholder="2025-12-20T09:00:00"
                {...register("startTime")}
              />
              {errors.startTime && (
                <div className="errorText">{errors.startTime.message}</div>
              )}
            </label>

            <label className="label">
              End (ISO)
              <input
                className="input"
                placeholder="2025-12-20T10:00:00"
                {...register("endTime")}
              />
              {errors.endTime && (
                <div className="errorText">{errors.endTime.message}</div>
              )}
            </label>
          </div>

          <label className="label">
            Plats
            <input className="input" {...register("location")} />
            {errors.location && (
              <div className="errorText">{errors.location.message}</div>
            )}
          </label>

          <label className="label">
            Anteckningar
            <textarea className="textarea" rows={3} {...register("notes")} />
          </label>

          <div className="actions">
            <button className="btnPrimary" type="submit">
              Skapa bokning
            </button>
            <button className="btnSecondary" type="button" onClick={() => nav("/bookings")}>
              Avbryt
            </button>
          </div>

          <div className="hint">
            Tips: Du kan senare byta till datetime-local för bättre UX.
          </div>
        </form>
      </div>
    </div>
  );
}
