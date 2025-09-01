"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          새로운 농구장 등록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">장소명</label>
            <Input
              {...register("name")}
              placeholder="농구장 이름을 입력하세요"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">주소</label>
            <div className="flex gap-2">
              <Input
                {...register("address")}
                placeholder="주소를 입력하거나 좌표에서 가져오세요"
                className={errors.address ? "border-red-500" : ""}
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
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </Button>
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              리뷰 (선택사항)
            </label>
            <Textarea
              {...register("review")}
              placeholder="농구장에 대한 간단한 리뷰를 남겨주세요 (50자 이하)"
              maxLength={50}
              className={errors.review ? "border-red-500" : ""}
            />
            {errors.review && (
              <p className="text-red-500 text-sm mt-1">
                {errors.review.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              사진 (선택사항)
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="미리보기"
                className="w-full h-32 object-cover rounded-md mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              농구장 유형
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isIndoor === false ? "default" : "outline"}
                onClick={() => setValue("isIndoor", false)}
                className="flex-1"
              >
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  실외
                </Badge>
              </Button>
              <Button
                type="button"
                variant={isIndoor === true ? "default" : "outline"}
                onClick={() => setValue("isIndoor", true)}
                className="flex-1"
              >
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                >
                  실내
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  등록 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  등록하기
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
