import BurgerMenu from '@/components/nav/BurgerMenu';
import Option from '@/components/nav/Option';
import ParentOption from '@/components/nav/SubDrawer';

const CSidebar = () => {
    return  (
        <BurgerMenu size="h-nav-item-height" className="mr-1 lg:hidden">
            <Option href="/about" className="!rounded-full px-4">About</Option>
            <Option href="/reserve?display=myreservations" className="!rounded-full px-4">Reservations</Option>
            <ParentOption text="Services" className="px-4">
                <Option href="/reserve?display=themes&service=wedding&set=1&series=1" className="!rounded-full px-4">Wedding</Option>
                <Option href="/reserve?display=themes&service=debut&set=1&series=1" className="!rounded-full px-4">Debut</Option>
                <Option href="/reserve?display=themes&service=kidsparty&set=1&series=1" className="!rounded-full px-4">Kids Party</Option>
                <Option href="/reserve?display=themes&service=privateparty&set=1&series=1" className="!rounded-full px-4">Private Party</Option>
            </ParentOption>
           { /* <ParentOption text="Packages" className="px-4">
                <Option href="" className="!rounded-full px-4">Wedding</Option>
                <Option href="" className="!rounded-full px-4">Debut</Option>
                <Option href="" className="!rounded-full px-4">Kids Party</Option>
                <Option href="" className="!rounded-full px-4">Private Party</Option>
            </ParentOption> */ }
            <Option href="/contact" className="!rounded-full px-4">Contact</Option>
        </BurgerMenu>
    );
}

export default CSidebar;
