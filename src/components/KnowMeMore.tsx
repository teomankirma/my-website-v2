// import { Spacer, Button, Link } from "@heroui/react";
// import { SectionHeader } from "@/components/common";
// import { useAppStore } from "@/hooks/useAppStore";
// import { translations } from "@/i18n";

// function KnowMeMore() {
//   const { language } = useAppStore();
//   const {
//     knowMeMore,
//     whoAmIFirst,
//     name,
//     whoAmISecond,
//     aboutMe,
//     myExperiences,
//   } = translations[language];

//   return (
//     <div id="aboutMe">
//       <div>
//         <SectionHeader header={knowMeMore} />
//       </div>
//       <Spacer y={3} />
//       <div>
//         <div>
//           <div>
//             <h3>
//               {whoAmIFirst} <span className="text-accent">{name}</span>,
//               {whoAmISecond}.
//             </h3>
//             <h3>{aboutMe}</h3>
//             <Spacer y={1} />
//             <h3>{myExperiences}</h3>
//           </div>
//         </div>
//         <div>
//           <ul>
//             <li>
//               <h3>
//                 <b className="li-b">{nameText}</b>
//                 {name}
//               </h3>
//               <hr className="li-hr" />
//             </li>
//             <li>
//               <h3>
//                 <b>{emailText}</b>
//                 <Link href="mailto: teomankirma@gmail.com">{email}</Link>
//               </h3>
//               <hr />
//             </li>
//             <li>
//               <h3>
//                 <b className="li-b">{ageText}</b>
//                 {age}
//               </h3>
//               <hr className="li-hr" />
//             </li>
//             <li>
//               <h3>
//                 <b className="li-b">{fromText}</b>
//                 {context.language.from}
//               </Text>
//             </li>
//             <Spacer y={1} />
//             <li className="center-item">
//               <a href={resume} download>
//                 <Button color="success" size="lg" radius="full">
//                   {downloadResume}
//                 </Button>
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <div>
//             <h2>{experienceYear}</h2>
//             <h6>{experienceText}</h6>
//           </div>
//           <div>
//             <h2>{projectsNumber}</h2>
//             <h6>{projectsText}</h6>
//           </div>
//         </div>
//       </div>
//       <Spacer y={3} />
//     </div>
//   );
// }

// export default KnowMeMore;
