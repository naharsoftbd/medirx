<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PageBlock;

class PageBlockService
{
    public function syncPageBlocks(Page $page, array $blocks): array
    {
        $keptIds = [];

        foreach ($blocks as $index => $block) {
            $blockId = isset($block['id']) && is_numeric($block['id']) ? (int) $block['id'] : null;

            $payload = [
                'type'     => $block['type'],
                'label'    => $block['label'],
                'content'  => $this->normalizeContent($block['content'] ?? []),
                'position' => $index,
            ];

            $pageBlock = $blockId
                ? $page->blocks()->whereKey($blockId)->first()
                : null;

            if ($pageBlock) {
                $pageBlock->update($payload);
            } else {
                $pageBlock = $page->blocks()->create($payload);
            }

            $keptIds[] = $pageBlock->id;
        }

        $page->blocks()
            ->when($keptIds !== [], fn ($query) => $query->whereNotIn('id', $keptIds), fn ($query) => $query)
            ->delete();

        return $page->blocks()->orderBy('position')->get()->all();
    }

    public function updateBlockContent(PageBlock $block, mixed $content): PageBlock
    {
        $block->content = $this->normalizeContent($content);
        $block->save();

        return $block->fresh();
    }

    protected function normalizeContent(mixed $content): mixed
    {
        if (is_string($content)) {
            $decoded = json_decode($content, true);

            return json_last_error() === JSON_ERROR_NONE ? $decoded : $content;
        }

        return $content;
    }
}
