"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { CourtFormData } from "@/types";

const courtFormSchema = z.object({
  name: z.string().min(1, "장소명을 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  review: z.string().max(50, "리뷰는 50자 이하로 입력해주세요").optional(),
  isIndoor: z.boolean(),
});

type CourtFormValues = z.infer<typeof courtFormSchema>;

interface CourtFormProps {
  latitude: number;
  longitude: number;
  initialAddress?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CourtForm = ({
  latitude,
  longitude,
  initialAddress,
  onSuccess,
  onCancel,
}: CourtFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string>(initialAddress ?? "");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourtFormValues>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: {
      isIndoor: false,
    },
  });

  const isIndoor = watch("isIndoor");

  // 좌표로 주소 가져오기
  const handleGetAddress = async () => {
    try {
      setIsLoading(true);
      const addressResult = await apiClient.getAddress(latitude, longitude);
      setAddress(addressResult);
      setValue("address", addressResult);
    } catch (error) {
      console.error("주소 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 업로드 (임시로 URL 입력 방식)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제로는 Cloudinary나 S3에 업로드하는 로직이 필요
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageName(file.name);
    } else {
      setImageUrl("");
      setImageName("");
    }
  };

  const onSubmit = async (data: CourtFormValues) => {
    try {
      setIsLoading(true);

      const courtData: CourtFormData = {
        ...data,
        latitude,
        longitude,
        imageUrl: imageUrl || undefined,
      };

      await apiClient.createCourt(courtData);
      onSuccess();
    } catch (error) {
      console.error("농구장 등록 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <header className="flex flex-col gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            농구장 등록하기
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            선택한 위치를 바탕으로 필요한 정보를 간단히 입력해주세요.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-500">
            Location
          </p>
          <p className="mt-2 font-mono text-sm font-semibold text-amber-700">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
          <p className="mt-1 text-xs text-amber-500/80">
            지도에서 선택된 좌표입니다.
          </p>
        </section>

        <form
          id="court-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-slate-600">
              기본 정보
            </legend>
            <div className="space-y-6">
              <div className="space-y-3">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="court-name"
                >
                  장소명
                </label>
                <Input
                  id="court-name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  placeholder="예) 동네체육관 2층 코트"
                  className={`h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-400 focus-visible:ring-amber-100 ${
                    errors.name
                      ? "border-red-400 focus-visible:ring-red-100"
                      : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="court-address"
                >
                  주소
                </label>
                <div className="flex gap-2">
                  <Input
                    id="court-address"
                    {...register("address")}
                    aria-invalid={!!errors.address}
                    placeholder="주소를 직접 입력하거나 좌표에서 불러오기"
                    className={`h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-400 focus-visible:ring-amber-100 ${
                      errors.address
                        ? "border-red-400 focus-visible:ring-red-100"
                        : ""
                    }`}
                    value={address}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAddress(v);
                      setValue("address", v, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetAddress}
                    disabled={isLoading}
                    className="h-11 flex-shrink-0 rounded-2xl border-slate-200 bg-white px-3 text-amber-600"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-slate-600">
              추가 정보
            </legend>
            <div className="space-y-6">
              <div className="space-y-3">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="court-review"
                >
                  리뷰 (선택사항)
                </label>
                <Textarea
                  id="court-review"
                  {...register("review")}
                  aria-invalid={!!errors.review}
                  placeholder="농구장 상태나 이용 팁을 50자 이내로 적어주세요"
                  maxLength={50}
                  className={`min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-400 focus-visible:ring-amber-100 ${
                    errors.review
                      ? "border-red-400 focus-visible:ring-red-100"
                      : ""
                  }`}
                />
                {errors.review && (
                  <p className="text-xs text-red-500">
                    {errors.review.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label
                  className="text-sm font-medium text-slate-800"
                  htmlFor="court-image"
                >
                  사진 업로드
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    (선택)
                  </span>
                </label>
                <input
                  id="court-image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500">
                  <div className="flex flex-col flex-1">
                    <span className="min-h-[20px] truncate text-slate-700">
                      {imageName || "이미지 파일을 선택해주세요"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      JPG, PNG 등 최대 5MB 파일을 업로드할 수 있어요.
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 rounded-xl bg-amber-500 px-5 text-sm font-semibold text-white"
                  >
                    파일 선택
                  </Button>
                </div>
                {imageUrl && (
                  <div className="relative h-40 overflow-hidden rounded-2xl border border-slate-100">
                    <Image
                      src={imageUrl}
                      alt="미리보기"
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-800">
                  농구장 유형
                </span>
                <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setValue("isIndoor", false, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                    aria-pressed={isIndoor === false}
                    className={`h-10 flex-1 rounded-xl text-sm font-medium ${
                      isIndoor === false
                        ? "bg-white text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    실외
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setValue("isIndoor", true, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                    aria-pressed={isIndoor === true}
                    className={`h-10 flex-1 rounded-xl text-sm font-medium ${
                      isIndoor === true
                        ? "bg-white text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    실내
                  </Button>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 md:flex-row md:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 flex-1 rounded-2xl border-slate-200 bg-white text-slate-600"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="h-11 flex-1 rounded-2xl bg-amber-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  등록하기
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
