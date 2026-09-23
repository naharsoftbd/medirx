import ExperienceSvg from '@/components/Icon/ExperienceSvg';
import SpecializationSvg from '@/components/Icon/SpecializationSvg';
import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, CalendarDays, MapPin, Stethoscope } from 'lucide-react';

export default function DoctorCard({ doctor }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--base-color)] bg-white shadow-md transition hover:shadow-lg">
            <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="inline-block rounded-full bg-[var(--base-color)] px-3 py-1 text-sm font-semibold text-white">
                            {doctor.specialty}
                        </span>
                        <h2 className="mt-4 flex text-2xl font-bold text-gray-800">
                            <Stethoscope className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                            {doctor.name}
                        </h2>
                        <h3 className="mt-1 flex text-xl font-bold text-gray-600">
                            <BriefcaseBusiness className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                            {doctor.title}
                        </h3>
                        <div className="flex text-sm text-gray-600">
                            <MapPin className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                            {doctor.institution}
                        </div>
                    </div>
                    <div className="flex h-auto w-[170px] items-center justify-center overflow-hidden rounded-full bg-gray-200 text-blue-600">
                        {doctor?.profile_image_url ? (
                            <img className="rounded-full" src={doctor?.profile_image_url} />
                        ) : (
                            <img className="rounded-full" src={`${route().t.url}/images/doctor_icon.png`} />
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="flex text-lg font-semibold text-gray-700">
                        <div className="mr-2">
                            <SpecializationSvg />
                        </div>{' '}
                        Specialties
                    </h4>

                    {doctor.specialization.map((specialization, idx) => (
                        <div key={idx} className="mt-1 text-sm text-gray-600">
                            {specialization.name}
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <h4 className="flex text-sm font-semibold text-gray-700">
                        <CalendarDays className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                        Availability
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-sm text-green-800">
                            <i className="fas fa-calendar-check mr-1"></i> {doctor.availableDays.join(', ')}
                        </span>
                        {doctor.unavailableDays.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-sm text-red-800">
                                <i className="fas fa-calendar-times mr-1"></i> {doctor.unavailableDays.join(', ')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="flex text-xl font-semibold text-gray-700">
                        <div className="mr-2">
                            <ExperienceSvg />
                        </div>
                        Experience
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">{doctor.experience} years of experience</p>
                </div>

                <div className="mt-6">
                    <h4 className="flex text-sm font-semibold text-gray-700">
                        <MapPin className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                        Location
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">{doctor.hospital}</p>
                </div>
            </div>

            <div className="flex justify-between gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
                <Link
                    href={route('doctors.frontend.show', doctor.uuid)}
                    className="rounded-lg border bg-[var(--btn-base-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--btn-base-hover-color)]"
                >
                    VIEW PROFILE
                </Link>
                <Link
                    href={route('appointments.create_for_patient', { doctor_id: doctor.id })}
                    className="rounded-lg bg-[var(--btn-base-color)] px-4 py-2 text-sm text-white transition hover:bg-[var(--btn-base-hover-color)]"
                >
                    BOOK APPOINTMENT
                </Link>
            </div>
        </div>
    );
}
