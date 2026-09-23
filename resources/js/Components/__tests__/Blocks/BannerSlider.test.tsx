import BannerSlider from '@/components/Blocks/BannerSlider';
import { act, fireEvent, render, screen } from '@testing-library/react';

jest.useFakeTimers();

const banners = [
    { banner_image_url: '/1.jpg', title: 'Slide 1', subtitle: 'S1' },
    { banner_image_url: '/2.jpg', title: 'Slide 2', subtitle: 'S2' },
];

function getSlideByText(text: string) {
    const el = screen.getByText(text);
    return el.parentElement?.parentElement; // <-- get wrapper with opacity classes
}

describe('BannerSlider Component', () => {
    it('renders first slide initially', () => {
        render(<BannerSlider banners={banners} />);

        const slide1 = getSlideByText('Slide 1');
        const slide2 = getSlideByText('Slide 2');

        expect(slide1).toHaveClass('opacity-100');
        expect(slide2).toHaveClass('opacity-0');
    });

    it('moves to next slide when › clicked', () => {
        render(<BannerSlider banners={banners} />);

        fireEvent.click(screen.getByText('›'));

        const slide2 = getSlideByText('Slide 2');

        expect(slide2).toHaveClass('opacity-100');
    });

    it('moves to previous slide when ‹ clicked', () => {
        render(<BannerSlider banners={banners} />);

        fireEvent.click(screen.getByText('‹'));

        const slide2 = getSlideByText('Slide 2');

        expect(slide2).toHaveClass('opacity-100');
    });

    it('auto-play moves to next slide', () => {
        render(<BannerSlider banners={banners} interval={3000} />);

        act(() => jest.advanceTimersByTime(3000));

        const slide2 = getSlideByText('Slide 2');

        expect(slide2).toHaveClass('opacity-100');
    });
});
