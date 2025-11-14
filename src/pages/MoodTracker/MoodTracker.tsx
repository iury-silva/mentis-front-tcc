import React from "react";
import { MoodRecordCard } from "@/components/MoodRecord/MoodRecordCard";
import { useQuery } from "@tanstack/react-query";
import { moodRecordService } from "@/services/mood-record.service";
import type { MoodRecordsHistory } from "@/types/mood-record.types";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MoodTracker: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const moodRecordHistory = useQuery<MoodRecordsHistory>({
    queryKey: ["moodRecords", page],
    queryFn: async () => {
      const data = await moodRecordService.getMoodHistory({ page, limit });
      return data;
    },
    enabled: page > 0,
  });

  const { data, isError, refetch, isFetching } = moodRecordHistory;

  const totalPages = data?.pagination.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <p className="text-red-600">Erro ao carregar os registros.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isFetching && (
        <div className="space-y-4">
          {[...Array(limit)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}
      {data &&
        !isFetching &&
        data.records.map((record) => (
          <MoodRecordCard key={record.id} record={record} />
        ))}
      {data && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showFirstLast={totalPages > 5}
          maxVisiblePages={5}
        />
      )}
    </div>
  );
};

export default MoodTracker;
