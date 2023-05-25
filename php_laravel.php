<?php

namespace App\OurLogix\Services;

use App\OurLogix\Repositories\PromoCodeRepository;
use App\Models\PromoCode;
use Carbon\Carbon;
use Illuminate\Support\Facades\Event;
use App\Models\States\PromoCode\PromoCodeStates;
use App\Events\PromoCode\PromoCodeCreated;
use App\Events\PromoCode\PromoCodeDeleted;
use App\Events\PromoCode\PromoCodeUpdated;

class PromoCodeService extends Service
{
    protected string $repositoryName = PromoCodeRepository::class;

    /**
     * Store a new promocode in the database.
     *
     * @param  array  $promoCode
     * @param  integer  $promoCode
     * @return App\Models\PromoCode
     */
    public function create(array $promoCode, $domainId): bool | PromoCode
    {
        $this->preparePromoCodeData($promoCode, $domainId);
        $promoCodeModel =  $this->repository->create($promoCode);
         /*Note: To save product minimum qunatity in pivot table*/
        $promoCodeModel->products()->sync($this->formatProducts($promoCode), ['detach' => false]);
        PromoCodeCreated::dispatch($promoCodeModel->fresh());
        return $promoCodeModel;
    }

     /**
     * Update a new promocode in the database.
     *
     * @param  array  $payload
     * @param  Object  $promoCode
     * @return Boolean
     */
    public function update(array $payload, $promoCode, $domainId): bool | PromoCode
    {
        $this->preparePromoCodeData($payload, $domainId);
        $updatedBool = $promoCode->update($payload);
        /*Note: To save product minimum qunatity in pivot table*/
        $promoCode->products()->sync($this->formatProducts($payload));
        PromoCodeUpdated::dispatch($promoCode->fresh());
        return $updatedBool;
    }

    /**
     * Format products selected on promocode registration
     *
     * @return array
     */
    private function formatProducts($payload): array
    {
        $promableProducts = [];
        if (collect($payload)->has('products') && collect($payload['products'])->count() > 0) {
            $promableProducts = collect($payload['products'])->map(function ($item, $productId) {
                return ["promoable_id" => $productId, 'data' => ['min_quantity' => $item]];
            })->values()->toArray();
        }
        return $promableProducts;
    }

    /**
     * Prepare promocode details for model save
     *
     * @return array
     */
    private function preparePromoCodeData(&$promoCodeInputData, $domainId): array
    {
        $status = collect($promoCodeInputData)->get('status');
        $promoCodeInputData['domain_id'] = $domainId;
        $promoCodeInputData['settings'] = collect($promoCodeInputData)->only(PromoCode::getCustomColumns())->toArray();
        /*Note: during step1 start_at will not consider*/
        if (collect($promoCodeInputData)->get('start_at')) {
            $startDate = Carbon::createFromFormat('Y-m-d H:i:s', $promoCodeInputData['start_at']);
            if ($startDate->greaterThan(Carbon::now())) {
                $status = PromoCode::STATUS_SCHEDULED;
            }
        }
        if ($status != null) {
            $promoCodeInputData['status'] = PromoCodeStates::make($status, $promoCodeInputData);
            $promoCodeInputData['statusText'] = $status;
        }
        return $promoCodeInputData;
    }

     /**
     * Change the status of promocode to archive
     *
     * @return void
     */
    public function archive(PromoCode $promoCode): void
    {
        $promoCode->status->transitionTo(PromoCode::STATUS_ARCHIVED);
        PromoCodeDeleted::dispatch($promoCode->fresh());
    }
    /**
     * Get all promocodes leading to expiry
     *
     * @return array
     */
    public function getPromoCodesHeadToExpiry(): array
    {
        return $this->repository->whereNotIn('status', [PromoCode::STATUS_EXPIRED, PromoCode::STATUS_COMPLETED])->whereDate('expired_at', '<=', Carbon::now()->toDateString())
        ->whereTime('expired_at', '<', Carbon::now()->toTimeString());
    }
}
