import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface NoteInputProps {
  noteText: string;
  setNoteText: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const NoteInput: React.FC<NoteInputProps> = ({
  noteText,
  setNoteText,
  isRecording,
  setIsRecording,
}) => {
  const recognitionRef = useRef<any>(null);
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  // Function to correct common speech recognition errors for racing terminology
  const correctRacingTerminology = (text: string): string => {
    const corrections: { [key: string]: string } = {
      // Driver name corrections
      'kyle larsen': 'Kyle Larson',
      'kyle larson': 'Kyle Larson',
      'alex bowman': 'Alex Bowman',
      'ross chastain': 'Ross Chastain',
      'daniel suarez': 'Daniel Suarez',
      'austin dillon': 'Austin Dillon',
      'connor zilisch': 'Connor Zilisch',
      'carson kvapil': 'Carson Kvapil',
      'austin hill': 'Austin Hill',
      'jesse love': 'Jesse Love',
      'nick sanchez': 'Nick Sanchez',
      'daniel dye': 'Daniel Dye',
      'grant enfinger': 'Grant Enfinger',
      'daniel hemric': 'Daniel Hemric',
      'connor mosack': 'Connor Mosack',
      'kaden honeycutt': 'Kaden Honeycutt',
      'rajah caruth': 'Rajah Caruth',
      'andres perez': 'Andres Perez',
      'matt mills': 'Matt Mills',
      'dawson sutton': 'Dawson Sutton',
      'tristan mckee': 'Tristan McKee',
      'helio meza': 'Helio Meza',
      'corey day': 'Corey Day',
      'ben maier': 'Ben Maier',
      'tyler reif': 'Tyler Reif',
      'brenden queen': 'Brenden Queen',
      
      // Racing terminology corrections
      'nascar': 'NASCAR',
      'rpm': 'RPM',
      'under steer': 'understeer',
      'over steer': 'oversteer',
      'aero dynamics': 'aerodynamics',
      'down force': 'downforce',
      'super speedway': 'superspeedway',
      'back stretch': 'backstretch',
      'front stretch': 'frontstretch',
      'pace car': 'pace car',
      'safety car': 'safety car',
      'side by side': 'side-by-side',
      'three wide': 'three-wide',
      'four wide': 'four-wide',
      'single file': 'single-file',
      'double file': 'double-file',
      'pack racing': 'pack racing',
      'sling shot': 'slingshot',
      'straight away': 'straightaway',
      'hair pin': 'hairpin',
      'fall off': 'fall-off',
      'heat cycle': 'heat cycle',
      'cross weight': 'cross-weight',
      'left side': 'left-side',
      'right side': 'right-side',
      'sway bar': 'sway bar',
      'track bar': 'track bar',
      'counter steer': 'countersteer',
      'dial in': 'dial in',
      'dialing in': 'dialing in',
      'way off': 'way off',
      'miles off': 'miles off',
      'in the ballpark': 'in the ballpark',
      'on the money': 'on the money',
      'spot on': 'spot-on',
      'nailed it': 'nailed it',
      'missed it': 'missed it',
      'coming to me': 'coming to me',
      'going away': 'going away',
      'getting better': 'getting better',
      'getting worse': 'getting worse',
      
      // Common misheard words
      'lose': 'loose',
      'breaks': 'brakes',
      'break': 'brake',
      'tires': 'tires',
      'tire': 'tire',
      'fuel': 'fuel',
      'pit': 'pit',
      'pits': 'pits',
      'setup': 'setup',
      'set up': 'setup',
      'handling': 'handling',
      'balance': 'balance',
      'neutral': 'neutral',
      'push': 'push',
      'plow': 'plow',
      'slide': 'slide',
      'rotate': 'rotate',
      'turn': 'turn',
      'steer': 'steer',
      'control': 'control',
      'smooth': 'smooth',
      'aggressive': 'aggressive',
      'patient': 'patient',
      'conservative': 'conservative',
      'risky': 'risky',
      'bold': 'bold',
      'smart': 'smart',
      'mistake': 'mistake',
      'error': 'error',
      'perfect': 'perfect',
      'good': 'good',
      'bad': 'bad',
      'excellent': 'excellent',
      'fast': 'fast',
      'quick': 'quick',
      'slow': 'slow',
      'responsive': 'responsive',
      'sharp': 'sharp',
      'consistent': 'consistent',
      'predictable': 'predictable',
      'stable': 'stable',
      'planted': 'planted',
      'nervous': 'nervous',
      'comfortable': 'comfortable',
      'confident': 'confident',
      'focused': 'focused',
      'improving': 'improving',
      'declining': 'declining'
    };

    let correctedText = text.toLowerCase();
    
    // Apply corrections
    Object.entries(corrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      correctedText = correctedText.replace(regex, correct);
    });

    // Capitalize first letter of sentences
    correctedText = correctedText.replace(/(^|\. )([a-z])/g, (match, prefix, letter) => {
      return prefix + letter.toUpperCase();
    });

    return correctedText;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        
        // Enhanced settings for better accuracy
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 3;
        
        // Add racing-specific vocabulary hints if supported
        if ('grammars' in recognitionRef.current) {
          const grammar = '#JSGF V1.0; grammar racing; public <racing> = Kyle Larson | Alex Bowman | Ross Chastain | Daniel Suarez | Austin Dillon | Connor Zilisch | Carson Kvapil | Austin Hill | Jesse Love | Nick Sanchez | Daniel Dye | Grant Enfinger | Daniel Hemric | Connor Mosack | Kaden Honeycutt | Rajah Caruth | Andres Perez | Matt Mills | Dawson Sutton | Tristan McKee | Helio Meza | Corey Day | Ben Maier | Tyler Reif | Brenden Queen | NASCAR | racing | driver | lap | turn | speed | throttle | brake | pit | tire | fuel | setup | handling | loose | tight | understeer | oversteer | aerodynamics | downforce | suspension | gear | transmission | engine | horsepower | torque | RPM | qualifying | practice | race | finish | position | points | championship | track | oval | road course | superspeedway | short track | intermediate | banking | groove | apron | wall | infield | backstretch | frontstretch | restart | caution | yellow | green | checkered | flag | pace car | safety car | debris | spin | crash | wreck | contact | bump | draft | slingshot | side by side | three wide | four wide | pack racing | single file | double file | inside | outside | high | low | middle | groove | line | entry | exit | corner | apex | straightaway | chicane | esses | hairpin | carousel | kink | sweeper | fast | slow | wide | narrow | smooth | rough | bumpy | slippery | grip | traction | adhesion | bite | fall off | wear | degradation | compound | soft | hard | medium | prime | option | sticker | scuff | heat cycle | pressure | camber | toe | caster | spring | shock | damper | sway bar | track bar | wedge | cross weight | left side | right side | front | rear | balance | neutral | push | plow | slide | rotate | turn | steer | countersteer | correct | save | catch | recover | control | smooth | aggressive | patient | conservative | risky | bold | smart | mistake | error | bobble | miss | hit | nail | perfect | good | bad | terrible | awesome | excellent | fast | quick | slow | sluggish | responsive | lazy | sharp | dull | consistent | inconsistent | predictable | unpredictable | stable | unstable | planted | loose | nervous | twitchy | calm | settled | comfortable | uncomfortable | confident | scared | worried | concerned | happy | frustrated | angry | excited | pumped | focused | distracted | tired | fresh | strong | weak | improving | declining | getting better | getting worse | coming to me | going away | dialing in | off | close | way off | miles off | in the ballpark | on the money | spot on | perfect | nailed it | missed it | way off | close but not quite | almost | nearly | just about | exactly | precisely | roughly | approximately | around | about | maybe | possibly | probably | definitely | certainly | absolutely | no doubt | for sure | without question | clearly | obviously | apparently | seemingly | looks like | sounds like | feels like | seems like | appears | suggests | indicates | shows | demonstrates | proves | confirms | verifies | validates | supports | contradicts | disputes | challenges | questions | doubts | wonders | thinks | believes | suspects | assumes | guesses | estimates | calculates | measures | records | notes | observes | watches | sees | hears | feels | senses | detects | notices | spots | catches | finds | discovers | uncovers | reveals | exposes | shows | displays | exhibits | demonstrates | illustrates | explains | describes | details | outlines | summarizes | reports | states | says | tells | mentions | notes | comments | remarks | adds | continues | goes on | proceeds | moves on | next | then | after | before | during | while | when | where | how | why | what | who | which | that | this | these | those | here | there | now | then | today | yesterday | tomorrow | soon | later | earlier | recently | lately | currently | presently | at the moment | right now | just now | a moment ago | a while ago | some time ago | long ago | way back | ages ago | forever | never | always | sometimes | often | frequently | regularly | occasionally | rarely | seldom | hardly ever | once in a while | from time to time | every now and then | every so often | on and off | off and on | back and forth | up and down | in and out | round and round | over and over | again and again | time and time again | repeatedly | continuously | constantly | persistently | consistently | steadily | gradually | slowly | quickly | rapidly | fast | immediately | instantly | suddenly | abruptly | sharply | dramatically | significantly | substantially | considerably | noticeably | slightly | barely | hardly | scarcely | just | only | merely | simply | purely | entirely | completely | totally | fully | wholly | absolutely | perfectly | exactly | precisely | accurately | correctly | properly | right | wrong | incorrect | inaccurate | imprecise | rough | approximate | close | near | far | distant | remote | away | apart | separate | together | combined | united | joined | connected | linked | attached | detached | loose | tight | firm | solid | strong | weak | soft | hard | smooth | rough | bumpy | flat | level | even | uneven | crooked | straight | curved | bent | twisted | turned | angled | tilted | slanted | sloped | inclined | declined | raised | lowered | lifted | dropped | fallen | risen | increased | decreased | grown | shrunk | expanded | contracted | stretched | compressed | extended | retracted | pushed | pulled | moved | shifted | changed | altered | modified | adjusted | tuned | tweaked | fine tuned | dialed in | set up | configured | arranged | organized | prepared | ready | set | go | stop | start | begin | end | finish | complete | done | over | through | past | beyond | ahead | behind | in front | in back | on top | underneath | above | below | over | under | beside | next to | near | close | far | away | inside | outside | within | without | around | about | through | across | along | down | up | left | right | forward | backward | sideways | diagonal | straight | curved | circular | oval | round | square | rectangular | triangular | angular | sharp | dull | pointed | blunt | narrow | wide | thick | thin | long | short | tall | low | high | deep | shallow | big | small | large | little | huge | tiny | enormous | massive | gigantic | miniature | microscopic | visible | invisible | clear | unclear | obvious | hidden | apparent | subtle | bright | dark | light | heavy | loud | quiet | silent | noisy | smooth | rough | soft | hard | hot | cold | warm | cool | dry | wet | moist | damp | sticky | slippery | grippy | tacky | loose | tight | free | stuck | jammed | blocked | open | closed | locked | unlocked | secure | insecure | safe | dangerous | risky | cautious | careful | careless | reckless | wild | tame | calm | excited | nervous | relaxed | tense | stressed | comfortable | uncomfortable | easy | difficult | hard | simple | complex | complicated | confusing | clear | obvious | straightforward | tricky | challenging | demanding | tough | rough | smooth | gentle | harsh | severe | mild | extreme | moderate | average | normal | typical | unusual | strange | weird | odd | funny | serious | important | critical | vital | essential | necessary | optional | extra | additional | spare | backup | primary | secondary | main | minor | major | significant | insignificant | relevant | irrelevant | useful | useless | helpful | harmful | good | bad | excellent | terrible | awesome | awful | amazing | horrible | wonderful | dreadful | fantastic | pathetic | brilliant | stupid | smart | dumb | clever | foolish | wise | silly | serious | funny | hilarious | boring | interesting | exciting | dull | thrilling | scary | frightening | terrifying | calming | soothing | relaxing | stressful | worrying | concerning | reassuring | encouraging | discouraging | motivating | inspiring | depressing | uplifting | positive | negative | optimistic | pessimistic | hopeful | hopeless | confident | doubtful | certain | uncertain | sure | unsure | definite | indefinite | specific | general | particular | universal | individual | collective | personal | professional | formal | informal | official | unofficial | public | private | open | secret | hidden | visible | obvious | subtle | direct | indirect | straight | crooked | honest | dishonest | truthful | false | real | fake | genuine | artificial | natural | synthetic | organic | inorganic | living | dead | alive | lifeless | active | inactive | moving | stationary | static | dynamic | changing | constant | variable | fixed | flexible | rigid | soft | hard | liquid | solid | gas | plasma | matter | energy | force | power | strength | weakness | speed | velocity | acceleration | deceleration | momentum | inertia | friction | resistance | pressure | tension | compression | expansion | contraction | vibration | oscillation | rotation | revolution | translation | transformation | conversion | change | alteration | modification | adjustment | adaptation | evolution | development | growth | decline | progress | regression | improvement | deterioration | enhancement | degradation | upgrade | downgrade | increase | decrease | rise | fall | climb | drop | ascent | descent | advance | retreat | forward | backward | onward | return | arrival | departure | entrance | exit | beginning | end | start | finish | commencement | conclusion | initiation | termination | opening | closing | launch | landing | takeoff | touchdown | liftoff | blast off | countdown | timer | clock | watch | time | duration | period | interval | moment | instant | second | minute | hour | day | week | month | year | decade | century | millennium | past | present | future | history | now | then | when | where | how | why | what | who | which | that | this | these | those | here | there | everywhere | nowhere | somewhere | anywhere | always | never | sometimes | often | rarely | seldom | frequently | occasionally | regularly | irregularly | constantly | intermittently | continuously | discontinuously | permanently | temporarily | forever | briefly | momentarily | instantly | immediately | eventually | finally | ultimately | initially | originally | firstly | secondly | thirdly | lastly | previously | subsequently | consequently | therefore | thus | hence | accordingly | nevertheless | however | although | though | despite | regardless | notwithstanding | besides | moreover | furthermore | additionally | also | too | as well | likewise | similarly | conversely | oppositely | contrarily | alternatively | instead | rather | preferably | ideally | hopefully | fortunately | unfortunately | luckily | unluckily | surprisingly | unsurprisingly | obviously | clearly | apparently | seemingly | possibly | probably | definitely | certainly | surely | undoubtedly | questionably | arguably | allegedly | supposedly | reportedly | presumably | apparently | evidently | manifestly | patently | plainly | transparently | explicitly | implicitly | directly | indirectly | literally | figuratively | metaphorically | symbolically | actually | really | truly | genuinely | honestly | frankly | seriously | literally | practically | virtually | essentially | basically | fundamentally | primarily | mainly | chiefly | principally | largely | mostly | generally | typically | usually | normally | commonly | frequently | rarely | seldom | hardly | barely | scarcely | almost | nearly | approximately | roughly | about | around | exactly | precisely | specifically | particularly | especially | notably | remarkably | significantly | considerably | substantially | dramatically | drastically | radically | completely | totally | entirely | fully | wholly | partially | partly | somewhat | rather | quite | very | extremely | incredibly | amazingly | surprisingly | shockingly | stunningly | remarkably | notably | significantly | considerably | substantially | moderately | slightly | barely | hardly | scarcely | just | only | merely | simply | purely | solely | exclusively | entirely | completely | totally | fully | wholly | absolutely | perfectly | exactly | precisely | accurately | correctly | properly | appropriately | suitably | fittingly | rightly | wrongly | incorrectly | inaccurately | improperly | inappropriately | unsuitably | unfittingly | badly | poorly | well | good | better | best | worse | worst | excellent | outstanding | exceptional | remarkable | extraordinary | amazing | incredible | fantastic | wonderful | marvelous | superb | magnificent | splendid | brilliant | awesome | terrific | great | fine | nice | pleasant | lovely | beautiful | gorgeous | stunning | attractive | appealing | charming | delightful | enjoyable | satisfying | fulfilling | rewarding | gratifying | pleasing | comforting | soothing | calming | relaxing | peaceful | tranquil | serene | quiet | silent | still | motionless | stationary | stable | steady | firm | solid | strong | robust | sturdy | durable | lasting | permanent | enduring | persistent | continuous | constant | consistent | regular | uniform | even | smooth | level | flat | straight | direct | clear | obvious | apparent | evident | visible | noticeable | detectable | perceptible | discernible | recognizable | identifiable | distinguishable | unmistakable | undeniable | indisputable | unquestionable | certain | sure | definite | positive | absolute | complete | total | full | entire | whole | all | every | each | any | some | many | few | several | numerous | countless | infinite | unlimited | boundless | endless | eternal | everlasting | perpetual | permanent | temporary | brief | short | long | extended | prolonged | protracted | sustained | continuous | ongoing | current | present | existing | active | live | real | actual | true | genuine | authentic | original | natural | normal | regular | standard | typical | usual | common | ordinary | average | medium | middle | central | main | primary | principal | chief | leading | top | first | initial | beginning | starting | opening | introductory | preliminary | preparatory | basic | fundamental | essential | necessary | required | mandatory | compulsory | obligatory | optional | voluntary | free | independent | autonomous | self governing | self sufficient | self reliant | self contained | self explanatory | self evident | self serving | self centered | selfish | selfless | generous | kind | caring | loving | affectionate | warm | friendly | nice | pleasant | agreeable | likeable | charming | attractive | appealing | interesting | engaging | captivating | fascinating | intriguing | curious | strange | odd | unusual | weird | bizarre | peculiar | unique | special | exceptional | extraordinary | remarkable | outstanding | excellent | superb | magnificent | wonderful | marvelous | fantastic | amazing | incredible | unbelievable | astonishing | astounding | stunning | shocking | surprising | unexpected | unpredictable | uncertain | doubtful | questionable | suspicious | dubious | skeptical | cynical | critical | negative | pessimistic | hopeless | despairing | depressed | sad | unhappy | miserable | wretched | awful | terrible | horrible | dreadful | appalling | disgusting | revolting | repulsive | offensive | unpleasant | disagreeable | annoying | irritating | frustrating | aggravating | infuriating | maddening | enraging | angering | upsetting | disturbing | troubling | worrying | concerning | alarming | frightening | scary | terrifying | horrifying | shocking | startling | surprising | unexpected | sudden | abrupt | sharp | quick | fast | rapid | swift | speedy | hasty | hurried | rushed | urgent | immediate | instant | instantaneous | prompt | timely | punctual | early | late | delayed | slow | sluggish | leisurely | relaxed | calm | peaceful | quiet | silent | still | motionless | stationary | stable | steady | firm | solid | strong | powerful | forceful | intense | severe | extreme | harsh | rough | tough | difficult | hard | challenging | demanding | strenuous | exhausting | tiring | fatiguing | draining | depleting | consuming | absorbing | engaging | involving | requiring | needing | wanting | desiring | wishing | hoping | expecting | anticipating | awaiting | looking forward | dreading | fearing | worrying | concerning | troubling | bothering | disturbing | upsetting | annoying | irritating | frustrating | aggravating | infuriating | maddening | enraging | angering | pleasing | satisfying | gratifying | rewarding | fulfilling | enjoyable | delightful | wonderful | marvelous | fantastic | amazing | incredible | unbelievable | astonishing | astounding | stunning | shocking | surprising | unexpected | predictable | expected | anticipated | foreseen | planned | intended | deliberate | purposeful | meaningful | significant | important | crucial | vital | essential | necessary | required | needed | wanted | desired | wished | hoped | expected | anticipated | awaited | looked forward | dreaded | feared | worried | concerned | troubled | bothered | disturbed | upset | annoyed | irritated | frustrated | aggravated | infuriated | maddened | enraged | angered | pleased | satisfied | gratified | rewarded | fulfilled | enjoyed | delighted | wondered | marveled | fantasized | amazed | incredulous | unbelieving | astonished | astounded | stunned | shocked | surprised | unexpected | unpredictable | predictable | expected | anticipated | foreseen | planned | intended | deliberate | purposeful | meaningful | significant | important | crucial | vital | essential | necessary | required | needed | wanted | desired | wished | hoped | expected | anticipated | awaited;';
          
          try {
            const speechRecognitionList = new (window as any).webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognitionRef.current.grammars = speechRecognitionList;
          } catch (e) {
            console.log('Grammar not supported, continuing without it');
          }
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Update interim text for real-time feedback
          setInterimText(interimTranscript);
          
          if (finalTranscript) {
            // Clean up the transcript
            const cleanedTranscript = finalTranscript
              .trim()
              .replace(/\s+/g, ' ') // Remove extra spaces
              .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
            
            const correctedTranscript = correctRacingTerminology(cleanedTranscript);
            const newText = noteText ? `${noteText} ${correctedTranscript}` : correctedTranscript;
            setNoteText(newText);
            setInterimText(''); // Clear interim text after final result
          }
        };

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setInterimText('');
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
          setInterimText('');
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setInterimText('');
          
          // Provide user-friendly error messages
          let errorMessage = 'Speech recognition error occurred.';
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try speaking again.';
              break;
            case 'audio-capture':
              errorMessage = 'Microphone not accessible. Please check your microphone permissions.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your internet connection.';
              break;
            case 'service-not-allowed':
              errorMessage = 'Speech recognition service not allowed. Please try again.';
              break;
          }
          
          // Show error to user (you might want to add a toast notification here)
          console.warn(errorMessage);
        };
      } else {
        setIsSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setNoteText, setIsRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current || !isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsRecording(false);
      }
    }
  };

  const displayText = noteText + (interimText ? ` ${interimText}` : '');

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={displayText}
          onChange={(e) => {
            // Only update if not currently showing interim results
            if (!interimText) {
              setNoteText(e.target.value);
            }
          }}
          placeholder="Enter your note here or click the microphone to start dictation..."
          className="w-full h-40 p-4 bg-gray-800 text-white border border-[#7cff00]/30 rounded-lg focus:outline-none focus:border-[#7cff00] resize-none"
        />
        <button
          onClick={toggleRecording}
          disabled={!isSupported}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
            !isSupported 
              ? 'bg-gray-500 cursor-not-allowed' 
              : isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-[#7cff00] hover:bg-[#6be600]'
          }`}
          title={!isSupported ? 'Speech recognition not supported' : isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <FaMicrophoneSlash className="w-5 h-5 text-white" />
          ) : (
            <FaMicrophone className={`w-5 h-5 ${!isSupported ? 'text-gray-300' : 'text-black'}`} />
          )}
        </button>
      </div>
      {isRecording && (
        <div className="text-[#7cff00] text-sm animate-pulse flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span>Recording... Speak clearly and pause between sentences for better accuracy</span>
        </div>
      )}
      {interimText && (
        <div className="text-gray-400 text-sm italic">
          Interim: {interimText}
        </div>
      )}
      {!isSupported && (
        <div className="text-yellow-500 text-sm">
          ⚠️ Speech recognition not supported. Please use Chrome, Edge, or Safari for voice input.
        </div>
      )}
    </div>
  );
};

export default NoteInput; 