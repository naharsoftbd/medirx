import BannerCropper from '@/components/BannerCropper';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

export default function BannerForm({ banner, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        title: banner?.title || '',
        subtitle: banner?.subtitle || '',
        link: banner?.link || '',
        active: banner?.active ?? true,
        image: null,
        cta_text: banner?.cta_text || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (banner) {
            post(route('banners.update', banner.id), { onSuccess: onClose });
        } else {
            post(route('banners.store'), { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">{banner ? 'Edit Banner' : 'Add Banner'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={data?.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Title"
                        className="w-full rounded border p-2"
                    />
                    <Input
                        type="text"
                        value={data?.subtitle}
                        onChange={(e) => setData('subtitle', e.target.value)}
                        placeholder="Subtitle"
                        className="w-full rounded border p-2"
                    />
                    <Input
                        type="url"
                        value={data?.link}
                        onChange={(e) => setData('link', e.target.value)}
                        placeholder="Redirect Link"
                        className="w-full rounded border p-2"
                    />

                    <Input
                        type="text"
                        value={data?.cta_text}
                        onChange={(e) => setData('cta_text', e.target.value)}
                        placeholder="Button Text"
                        className="w-full rounded border p-2"
                    />

                    {/* Image Upload */}
                    <div>
                        <BannerCropper data={data} field="image" setData={setData} initialImage={banner?.image ? banner.banner_image_url : null} />

                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.active} onChange={(e) => setData('active', e.target.checked)} />
                        Active
                    </label>

                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={onClose} className="text-white">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="text-white">
                            {banner ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
