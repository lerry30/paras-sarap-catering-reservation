import { ChevronRight, ChevronLeft } from '@/components/icons/All';
import { useRef, useEffect } from 'react';
import { toNumber } from '@/utils/number';

const Carousel = ({ children, switchWidth }) => {
    const gap = 8;
    const carouselWidth = (toNumber(switchWidth) + gap) * children.length ;

    const rectangle = useRef(null);
    const position = useRef(0);

    const scrollRight = () => {
        const parentElementRect = rectangle.current.parentElement.getBoundingClientRect();
        const carouselContRect = rectangle.current.getBoundingClientRect();
        const contXEnd = carouselContRect.x + carouselContRect.width;
        const parentXEnd = parentElementRect.x + parentElementRect.width;
        if(contXEnd < parentXEnd) return;
        position.current = position.current - toNumber(switchWidth) - gap;
        rectangle.current.style.transform = `translateX(${position.current}px)`;
    }

    const scrollLeft = () => {
        if(position.current === 0) return;
        position.current = position.current + toNumber(switchWidth) + gap;
        rectangle.current.style.transform = `translateX(${position.current}px)`;
    }

    useEffect(() => {
        for(const card of rectangle.current.children) {
            card.style.margin = `0 ${Math.ceil(gap/2)}px`;
        }
    }, []);

    return (
        <main className="relative size-full flex items-center">
            <section ref={rectangle} className="absolute flex left-[74px] transition-transform" style={{ width: `${carouselWidth}px` }}>
                { children }
            </section>
            <section onClick={scrollLeft} className="absolute left-0 h-full px-[20px] flex items-center backdrop-blur-sm">
                <ChevronLeft size={34} className="rounded-full bg-black stroke-white pr-[2px]" />
            </section>
            <section onClick={scrollRight} className="absolute right-0 h-full px-[20px] flex items-center backdrop-blur-sm">
                <ChevronRight size={34} className="rounded-full bg-black stroke-white pl-[2px]"/>
            </section>
        </main>
    )
}

export default Carousel;
